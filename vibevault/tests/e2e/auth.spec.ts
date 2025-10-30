import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display landing page', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Welcome to VibeVault')).toBeVisible();
    await expect(page.getByText('Get Started')).toBeVisible();
    await expect(page.getByText('Sign In')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Get Started').click();
    
    await expect(page).toHaveURL('/register');
    await expect(page.getByText('Create Account')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Sign In').click();
    
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Sign In')).toBeVisible();
  });

  test('should show registration form', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});
