export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      console.log('[UserMock] 登录请求body:', body);
      const { email, password } = body || {};
      console.log('[UserMock] 解析的email和password:', { email, password });
      if (email === 'admin@example.com' && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            id: 1,
            name: '管理员',
            email: 'admin@example.com',
            role: 'admin',
            token: 'mock-token-123456'
          }
        };
      }
      return {
        code: 401,
        message: '用户名或密码错误'
      };
    }
  },
  {
    url: '/api/users',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: [
          {
            id: 1,
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'admin'
          },
          {
            id: 2,
            name: '李四',
            email: 'lisi@example.com',
            role: 'user'
          },
          {
            id: 3,
            name: '王五',
            email: 'wangwu@example.com',
            role: 'user'
          }
        ]
      };
    }
  },
  {
    url: '/api/users/:id',
    method: 'get',
    response: ({ query }: any) => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          id: Number(query.id),
          name: '张三',
          email: 'zhangsan@example.com',
          role: 'user'
        }
      };
    }
  }
];
