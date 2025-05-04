import { test, expect } from "@playwright/test";
import { addDays, addYears, format } from "date-fns";

// Test data
const validProjectCode = "ABCD-1234";
const validRequestor = "John Doe";
const validDescription = "Test financing request for new equipment";
const validAmount = "10000";

const today = new Date();
const minValidStartDate = format(addDays(today, 16), "yyyy-MM-dd");
const validStartDate = minValidStartDate;
const validEndDate = format(
  addYears(new Date(validStartDate), 2),
  "yyyy-MM-dd"
);

// Mock API responses
const mockCountries = [
  { name: "United States", code: "US", opec: false },
  { name: "Saudi Arabia", code: "SA", opec: true },
  { name: "United Kingdom", code: "GB", opec: false },
];

const mockCurrencies = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
};

test.describe("Financing Request Form", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls to avoid reliance on external services
    await page.route("**/currencies.json", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockCurrencies),
      });
    });

    await page.route("**/v3.1/all", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(
          mockCountries.map((c) => ({
            name: { common: c.name },
            cca2: c.code,
          }))
        ),
      });
    });

    // Navigate to the homepage before each test
    await page.goto("http://localhost:3000/");

    // Wait for page to load completely
    await page.waitForLoadState("networkidle");

    // Ensure the form is loaded with a longer timeout
    await expect(
      page.locator('h2:has-text("New Financing Request")')
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display the form with all required fields", async ({ page }) => {
    // Check that all form elements are rendered
    await expect(page.locator('input[id="requestor"]')).toBeVisible();
    await expect(page.locator('select[id="originCountry"]')).toBeVisible();
    await expect(page.locator('input[id="projectCode"]')).toBeVisible();
    await expect(page.locator('textarea[id="description"]')).toBeVisible();
    await expect(page.locator('input[id="amount"]')).toBeVisible();
    await expect(page.locator('select[id="currency"]')).toBeVisible();
    await expect(page.locator('input[id="validityStartDate"]')).toBeVisible();
    await expect(page.locator('input[id="validityEndDate"]')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show validation errors for empty required fields", async ({
    page,
  }) => {
    // Submit the form without filling any fields
    await page.locator('button[type="submit"]').click();

    // Check for validation errors with longer timeout
    await expect(page.locator('text="Requestor name is required"')).toBeVisible(
      { timeout: 5000 }
    );
    await expect(page.locator('text="Country is required"')).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.locator(
        'text="Project code must be in XXXX-XXXX format with capital letters and digits 1-9"'
      )
    ).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text="Currency is required"')).toBeVisible({
      timeout: 5000,
    });
  });

  test("should enforce project code format (XXXX-XXXX)", async ({ page }) => {
    // Fill in an invalid project code
    await page.locator('input[id="projectCode"]').fill("invalid");

    // Click the submit button to trigger validation
    await page.locator('button[type="submit"]').click();

    // Check for validation error - using the exact error message from the schema
    await expect(
      page.locator(
        'text="Project code must be in XXXX-XXXX format with capital letters and digits 1-9"'
      )
    ).toBeVisible({ timeout: 5000 });

    // Fill in a valid project code
    await page.locator('input[id="projectCode"]').fill(validProjectCode);

    // Click the submit button again to trigger validation
    await page.locator('button[type="submit"]').click();

    // Add a small wait to ensure validation completes
    await page.waitForTimeout(500);

    // Error should no longer be visible
    await expect(
      page.locator(
        'text="Project code must be in XXXX-XXXX format with capital letters and digits 1-9"'
      )
    ).not.toBeVisible();
  });

  test("should validate date ranges for validity period", async ({ page }) => {
    // Fill in the validity start date
    await page.locator('input[id="validityStartDate"]').fill(validStartDate);

    // Click outside to trigger validation
    await page.locator("body").click();

    // Allow time for the UI to update
    await page.waitForTimeout(500);

    // Check that end date is enabled
    await expect(page.locator('input[id="validityEndDate"]')).toBeEnabled();

    // Check that the help text shows the valid range
    await expect(page.locator("text=/Must be between/")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should reset form on Reset button click", async ({ page }) => {
    // Fill in form fields
    await page.locator('input[id="requestor"]').fill(validRequestor);
    await page.locator('input[id="projectCode"]').fill(validProjectCode);
    await page.locator('textarea[id="description"]').fill(validDescription);
    await page.locator('input[id="amount"]').fill(validAmount);

    // Click Reset button
    await page.locator('button:has-text("Reset")').click();

    // Allow time for the form to reset
    await page.waitForTimeout(500);

    // Check that form was reset
    await expect(page.locator('input[id="requestor"]')).toHaveValue("");
    await expect(page.locator('input[id="projectCode"]')).toHaveValue("");
    await expect(page.locator('textarea[id="description"]')).toHaveValue("");
    await expect(page.locator('input[id="amount"]')).toHaveValue("");
  });

  test("should submit a valid form and show success message", async ({
    page,
  }) => {
    // Mock the API response for form submission
    await page.route("**/api/requests", (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    // Fill in all required fields with valid data
    await page.locator('input[id="requestor"]').fill(validRequestor);

    // Wait for the countries dropdown to be populated (with a longer timeout)
    await page.waitForFunction(
      () => {
        const select = document.querySelector('select[id="originCountry"]');
        return select instanceof HTMLSelectElement && select.options.length > 1;
      },
      { timeout: 15000 }
    );

    // Now select the country
    await page.selectOption('select[id="originCountry"]', { index: 1 });

    await page.locator('input[id="projectCode"]').fill(validProjectCode);
    await page.locator('textarea[id="description"]').fill(validDescription);
    await page.locator('input[id="amount"]').fill(validAmount);

    // Wait for the currencies to load
    await page.waitForFunction(
      () => {
        const select = document.querySelector('select[id="currency"]');
        return select instanceof HTMLSelectElement && select.options.length > 1;
      },
      { timeout: 15000 }
    );
    // await page.selectOption('select[id="currency"]', { index: 1 });

    await page.locator('input[id="validityStartDate"]').fill(validStartDate);
    await page.locator('input[id="validityEndDate"]').fill(validEndDate);

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Check for success message with longer timeout
    await expect(
      page.locator("text=Financing request submitted successfully!")
    ).toBeVisible({ timeout: 10000 });
  });
});
