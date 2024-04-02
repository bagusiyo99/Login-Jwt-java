package com.resto.service.admin;

import com.resto.dtos.CategoryDto;
import com.resto.entities.Category;
import com.resto.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServicempl implements AdminService {

    private final CategoryRepository categoryRepository;

    public AdminServicempl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryDto postCategory(CategoryDto categoryDto) throws IOException {
        Category category = new Category();
        category.setName(categoryDto.getName()); // Mengambil nilai nama dari DTO
        category.setDescription(categoryDto.getDescription()); // Mengambil nilai deskripsi dari DTO
        category.setImg(categoryDto.getImg().getBytes()); // Mengambil nilai gambar dari DTO

        Category createdCategory = categoryRepository.save(category);

        // Membuat objek CategoryDto untuk hasil yang akan dikembalikan
        CategoryDto createdCategoryDto = new CategoryDto();
        createdCategoryDto.setId(createdCategory.getId());

        return createdCategoryDto;
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(Category::getCategoryDto).collect(Collectors.toList());
    }
}
