import { BrandPackage } from './types';

const STORAGE_KEY = 'brandPackages';
const MAX_PACKAGES = 10; // Keep last 10 brand packages

export class BrandStorage {
  // Save a brand package to localStorage
  static savePackage(brandPackage: BrandPackage): void {
    try {
      const existingPackages = this.getAllPackages();
      
      // Add new package at the beginning
      const updatedPackages = [brandPackage, ...existingPackages];
      
      // Keep only the most recent packages
      const trimmedPackages = updatedPackages.slice(0, MAX_PACKAGES);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedPackages));
    } catch (error) {
      console.error('Error saving brand package:', error);
    }
  }

  // Get all saved brand packages
  static getAllPackages(): BrandPackage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const packages = JSON.parse(stored);
      return Array.isArray(packages) ? packages : [];
    } catch (error) {
      console.error('Error retrieving brand packages:', error);
      return [];
    }
  }

  // Get a specific package by ID
  static getPackageById(id: string): BrandPackage | null {
    const packages = this.getAllPackages();
    return packages.find(pkg => pkg.id === id) || null;
  }

  // Delete a package by ID
  static deletePackage(id: string): void {
    try {
      const packages = this.getAllPackages();
      const filtered = packages.filter(pkg => pkg.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting brand package:', error);
    }
  }

  // Clear all packages
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing brand packages:', error);
    }
  }

  // Get recent packages (for history display)
  static getRecentPackages(limit: number = 5): BrandPackage[] {
    const packages = this.getAllPackages();
    return packages.slice(0, limit);
  }

  // Check if storage is available
  static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}