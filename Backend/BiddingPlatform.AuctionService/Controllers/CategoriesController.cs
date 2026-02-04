using BiddingPlatform.AuctionService.Application.DTOs.Categories;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiddingPlatform.AuctionService.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET api/categories
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _categoryService.GetAllAsync());
    }

    // POST api/categories
    [Authorize(Roles = "ADMIN")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            ImageUrl = request.ImageUrl
        };

        await _categoryService.CreateAsync(category);

        return Ok(new
        {
            success = true,
            message = "Category created successfully."
        });
    }

    // PUT api/categories/{id}
    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(
        long id,
        [FromBody] UpdateCategoryRequest request)
    {
        var category = await _categoryService.GetByIdAsync(id);
        if (category == null)
            return NotFound();

        category.Name = request.Name;
        category.ImageUrl = request.ImageUrl;

        await _categoryService.UpdateAsync(category);

        return Ok(new
        {
            success = true,
            message = "Category updated successfully."
        });
    }

    // DELETE api/categories/{id}
    [Authorize(Roles = "ADMIN")]
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _categoryService.DeleteAsync(id);

        return Ok(new
        {
            success = true,
            message = "Category deleted successfully."
        });
    }
}
