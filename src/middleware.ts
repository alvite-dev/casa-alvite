import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se está acessando a área admin (exceto a página de login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      // Não há sessão, redirecionar para login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value);
      const { loginTime } = sessionData;

      // Verificar se a sessão não expirou (24 horas)
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - loginTime > twentyFourHours) {
        // Sessão expirada, redirecionar para login
        const loginUrl = new URL('/admin/login', request.url);
        const response = NextResponse.redirect(loginUrl);

        // Remover cookie expirado
        response.cookies.delete('admin_session');

        return response;
      }

      // Sessão válida, permitir acesso
      return NextResponse.next();

    } catch (error) {
      // Erro ao parsear cookie, redirecionar para login
      console.error('Erro ao validar sessão no middleware:', error);
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Permitir acesso a outras rotas
  return NextResponse.next();
}

// Configurar em quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
