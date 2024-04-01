package com.resto.service.admin;

import com.resto.dtos.CategoryDto;

import java.io.IOException;

public interface AdminService {
    CategoryDto postCategory(CategoryDto categoryDto) throws IOException;
}
