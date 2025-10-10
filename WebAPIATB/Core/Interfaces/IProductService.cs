using Core.Models.Product;

namespace Core.Interfaces;

public interface IProductService
{
    Task<List<ProductItemModel>> List();
    Task<List<ProductItemModel>> ListByCategory(int categoryId);
    Task<ProductItemModel?> GetItemById(int id);
    Task<ProductItemModel> Create(ProductCreateModel model);
    Task<ProductItemModel> Update(ProductUpdateModel model);
    
    Task Delete(long id);
}
