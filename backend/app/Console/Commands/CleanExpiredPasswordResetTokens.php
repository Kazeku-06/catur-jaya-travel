<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PasswordResetService;

class CleanExpiredPasswordResetTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auth:clean-expired-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean expired password reset tokens from database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $passwordResetService = app(PasswordResetService::class);
        
        $deletedCount = $passwordResetService->cleanExpiredTokens();
        
        $this->info("Cleaned {$deletedCount} expired password reset tokens.");
        
        return Command::SUCCESS;
    }
}
