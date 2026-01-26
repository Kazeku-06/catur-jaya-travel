<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        \Log::info('RoleMiddleware: Checking roles', [
            'requested_roles' => $roles,
            'user_authenticated' => !!$request->user(),
            'user_role' => $request->user()?->role,
            'url' => $request->url()
        ]);

        if (!$request->user()) {
            \Log::warning('RoleMiddleware: User not authenticated');
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRole = $request->user()->role;

        if (!in_array($userRole, $roles)) {
            \Log::warning('RoleMiddleware: User role not allowed', [
                'user_role' => $userRole,
                'required_roles' => $roles
            ]);
            return response()->json(['message' => 'Forbidden'], 403);
        }

        \Log::info('RoleMiddleware: Access granted');
        return $next($request);
    }
}
