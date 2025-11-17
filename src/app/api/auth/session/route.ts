import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const sessionCookie = cookies().get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value);
      const { username, loginTime } = sessionData;

      // Verificar se a sessão não expirou (24 horas)
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - loginTime > twentyFourHours) {
        // Sessão expirada, remover cookie
        cookies().delete('admin_session');
        return NextResponse.json(
          { authenticated: false, error: 'Sessão expirada' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          authenticated: true,
          user: {
            username,
          },
        },
        { status: 200 }
      );

    } catch (parseError) {
      console.error('Erro ao parsear cookie de sessão:', parseError);
      cookies().delete('admin_session');
      return NextResponse.json(
        { authenticated: false, error: 'Sessão inválida' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro na API de sessão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
