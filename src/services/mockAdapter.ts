/**
 * Mock数据适配器
 * 在生产环境中，直接复用开发环境的Mock数据
 */
import { AxiosError, AxiosResponse } from 'axios';
import type { MockMethod } from 'vite-plugin-mock';

// 导入所有Mock模块
import userMock from '@/mock/modules/user';
import orderMock from '@/mock/modules/order';
import trackingMock from '@/mock/modules/tracking';
import productionMock from '@/mock/modules/production';
import warehousingMock from '@/mock/modules/warehousing';
import carrierMock from '@/mock/modules/carrier';
import dispatchMock from '@/mock/modules/dispatch';
import vesselMock from '@/mock/modules/vessel';
import customsMock from '@/mock/modules/customs';

// 合并所有Mock配置
const allMocks: MockMethod[] = [
    ...(userMock as MockMethod[]),
    ...orderMock,
    ...trackingMock,
    ...productionMock,
    ...warehousingMock,
    ...carrierMock,
    ...dispatchMock,
    ...vesselMock,
    ...customsMock
];

/**
 * 匹配URL模式
 * 例如: /api/orders/:id 匹配 /api/orders/ORD202401001
 */
function matchUrl(pattern: string, url: string): { match: boolean; params: Record<string, string> } {
    // 标准化URL：移除baseURL前缀，确保以/api开头
    let cleanUrl = url.replace(/^https?:\/\/[^/]+/, ''); // 移除完整域名
    cleanUrl = cleanUrl.replace(/^\/tu-0121\/api/, '/api').replace(/^\/api/, '/api'); // 统一为/api开头

    // 标准化pattern：确保以/api开头
    let cleanPattern = pattern;
    if (!cleanPattern.startsWith('/api')) {
        cleanPattern = '/api' + (cleanPattern.startsWith('/') ? cleanPattern : '/' + cleanPattern);
    }

    // 完全匹配
    if (cleanUrl === cleanPattern) {
        return { match: true, params: {} };
    }

    // 将模式转换为正则表达式（支持:param占位符）
    const regexPattern = cleanPattern
        .replace(/\/:(\w+)/g, '/(?<$1>[^/]+)')
        .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    const match = cleanUrl.match(regex);

    if (match && match.groups) {
        const params: Record<string, string> = {};
        // 提取命名参数
        Object.keys(match.groups).forEach((key) => {
            params[key] = match.groups![key];
        });
        return { match: true, params };
    }

    return { match: false, params: {} };
}

/**
 * 根据请求信息查找匹配的Mock配置并执行
 */
function executeMock(config: any): any {
    // 获取请求URL（可能是相对路径）
    const requestUrl = config.url || '';
    // 获取baseURL
    const baseURL = config.baseURL || '';

    // 构建完整URL（用于匹配）
    let fullUrl = requestUrl;
    if (baseURL && !requestUrl.startsWith('http')) {
        // 如果URL不是绝对路径，拼接baseURL
        fullUrl = baseURL.replace(/\/$/, '') + '/' + requestUrl.replace(/^\//, '');
    }

    // 标准化URL：统一为/api开头的格式
    let normalizedUrl = fullUrl.replace(/^https?:\/\/[^/]+/, ''); // 移除域名
    normalizedUrl = normalizedUrl.replace(/^\/tu-0121\/api/, '/api'); // 移除/tu-0121前缀
    if (!normalizedUrl.startsWith('/api')) {
        normalizedUrl = '/api' + (normalizedUrl.startsWith('/') ? normalizedUrl : '/' + normalizedUrl);
    }

    const method = (config.method || 'get').toLowerCase();

    console.debug('[Mock] 尝试匹配:', {
        requestUrl,
        baseURL,
        fullUrl,
        normalizedUrl,
        method,
        mockCount: allMocks.length
    });

    // 查找匹配的Mock配置
    for (const mock of allMocks) {
        const mockUrl = typeof mock.url === 'string' ? mock.url : '';
        const mockMethod = (mock.method || 'get').toLowerCase();

        // 方法必须匹配
        if (mockMethod !== method) {
            continue;
        }

        // URL匹配 - 使用标准化后的URL
        const { match, params } = matchUrl(mockUrl, normalizedUrl);

        if (!match) {
            continue;
        }

        console.log('[Mock] 找到匹配:', { mockUrl, url: normalizedUrl, method });

        // 执行Mock响应函数
        try {
            const mockResponse = mock.response;
            if (typeof mockResponse === 'function') {
                // 构建请求参数对象（与vite-plugin-mock格式一致）
                const requestParams = {
                    url: normalizedUrl,
                    method,
                    query: {
                        ...config.params,
                        ...params // URL参数优先
                    },
                    body: config.data,
                    headers: config.headers
                };

                console.log('[Mock] 执行Mock响应函数:', {
                    url: normalizedUrl,
                    method,
                    body: config.data,
                    bodyType: typeof config.data,
                    bodyKeys: config.data ? Object.keys(config.data) : [],
                    requestParams
                });

                const response = mockResponse(requestParams);
                console.debug('[Mock] 返回响应:', response);
                return response;
            }
        } catch (error) {
            console.error('[Mock] 执行Mock响应失败:', error);
        }
    }

    console.debug('[Mock] 未找到匹配的Mock配置');
    return null;
}

/**
 * 在生产环境中，当请求失败时尝试返回Mock数据
 */
export async function mockAdapter(error: AxiosError): Promise<AxiosResponse | null> {
    const isProduction = import.meta.env.MODE === 'production';
    const useProductionMock = isProduction && !import.meta.env.VITE_API_BASE_URL;

    console.log('[MockAdapter] 被调用:', {
        isProduction,
        mode: import.meta.env.MODE,
        hasApiBaseUrl: !!import.meta.env.VITE_API_BASE_URL,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        useProductionMock
    });

    // 只在生产环境且没有配置真实API时使用Mock
    if (!useProductionMock) {
        console.log('[MockAdapter] 不满足条件，返回null');
        return null;
    }

    console.log('[MockAdapter] 满足条件，继续处理');

    const config = error.config;
    if (!config) {
        return null;
    }

    // 尝试执行Mock
    const mockResponse = executeMock(config);

    if (mockResponse) {
        // 模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 300));

        console.info('[Mock] 使用Mock数据:', config.url);
        return {
            data: mockResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config as any
        } as AxiosResponse;
    }

    return null;
}
