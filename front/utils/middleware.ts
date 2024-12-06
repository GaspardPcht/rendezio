import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');


  const protectedRoutes = ['/admin/dashboard'];

  // Redirigez vers la page de connexion si le token est manquant
  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    const url = new URL('/admin', req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}


export const config = {
  matcher: ['/admin/:path*'], // Appliquer aux pages sous "/admin"
};