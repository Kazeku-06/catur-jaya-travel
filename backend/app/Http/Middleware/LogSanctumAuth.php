<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogSanctumAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        
        \Log::info('Sanctum Auth Debug', [
            'url' => $request->url(),
            'method' => $request->method(),
            'has_bearer_token' => !!$token,
            'token_prefix' => $token ? substr($token, 0, 10) . '...' : null,
            'user_authenticated' => !!$request->user(),
            'user_id' => $request->user()?->id,
            'user_role' => $request->user()?->role,
        ]);

        return $next($request);
    }
}