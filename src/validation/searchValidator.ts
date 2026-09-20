/**
 * Bộ kiểm tra bộ lọc tìm kiếm phòng trống
 */

import { validateBookingDates, DateValidationResult } from './dateValidator';

export interface SearchFilterInput {
  checkInDate: string;
  checkOutDate: string;
  roomTypeId?: string;
  guests?: string | number;
  minPrice?: string | number;
  maxPrice?: string | number;
}

export interface SearchFilterValidationResult {
  isValid: boolean;
  dateValidation: DateValidationResult;
  errors: Record<string, string>;
  sanitized: {
    checkInDate: string;
    checkOutDate: string;
    roomTypeId?: string;
    guests?: number;
    minPrice?: number;
    maxPrice?: number;
  };
}

export function validateSearchFilters(input: SearchFilterInput): SearchFilterValidationResult {
  const errors: Record<string, string> = {};

  // 1. Kiểm tra ngày
  const dateValidation = validateBookingDates(input.checkInDate, input.checkOutDate);
  if (!dateValidation.isValid) {
    if (dateValidation.errors.checkInDate) errors.checkInDate = dateValidation.errors.checkInDate;
    if (dateValidation.errors.checkOutDate) errors.checkOutDate = dateValidation.errors.checkOutDate;
  }

  // 2. Kiểm tra số khách
  let guestsNum: number | undefined = undefined;
  if (input.guests !== undefined && input.guests !== '') {
    const gStr = String(input.guests).trim();
    if (!/^\d+$/.test(gStr)) {
      errors.guests = 'Số khách phải là số nguyên dương.';
    } else {
      guestsNum = parseInt(gStr, 10);
      if (guestsNum < 1) errors.guests = 'Số khách tối thiểu là 1.';
    }
  }

  // 3. Kiểm tra khoảng giá: không âm, min <= max
  let minPriceNum: number | undefined = undefined;
  let maxPriceNum: number | undefined = undefined;

  if (input.minPrice !== undefined && input.minPrice !== '') {
    const minStr = String(input.minPrice).trim();
    if (!/^\d+$/.test(minStr)) {
      errors.minPrice = 'Giá tối thiểu phải là số nguyên không âm.';
    } else {
      minPriceNum = parseInt(minStr, 10);
    }
  }

  if (input.maxPrice !== undefined && input.maxPrice !== '') {
    const maxStr = String(input.maxPrice).trim();
    if (!/^\d+$/.test(maxStr)) {
      errors.maxPrice = 'Giá tối đa phải là số nguyên không âm.';
    } else {
      maxPriceNum = parseInt(maxStr, 10);
    }
  }

  if (minPriceNum !== undefined && maxPriceNum !== undefined) {
    if (minPriceNum > maxPriceNum) {
      errors.priceRange = 'Giá tối thiểu không được lớn hơn giá tối đa.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    dateValidation,
    errors,
    sanitized: {
      checkInDate: input.checkInDate.trim(),
      checkOutDate: input.checkOutDate.trim(),
      roomTypeId: input.roomTypeId ? input.roomTypeId.trim() : undefined,
      guests: guestsNum,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
    },
  };
}
