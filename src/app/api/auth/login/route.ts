import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar credenciais das variáveis de ambiente
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Variáveis de ambiente ADMIN_USERNAME ou ADMIN_PASSWORD não configuradas');
      return NextResponse.json(
        { error: 'Configuração de autenticação inválida' },
        { status: 500 }
      );
    }

    // Validar credenciais
    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    // Criar sessão com cookie HttpOnly
    const sessionData = {
      username: adminUsername,
      loginTime: Date.now(),
    };

    // Cookie expira em 24 horas
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    cookies().set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          username: adminUsername,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro na API de login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
