export class Product {
  public isActive: boolean;
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly sku: string,
    public price: number,
    public stock: number,
    isActive?: boolean, // optional from persistence
  ) {
    this.validateBase();
    this.isActive = isActive ?? stock > 0;
  }

  private validateBase() {
    if (!this.name) throw new Error('Name is required');
    if (!this.sku) throw new Error('SKU is required');
    if (this.price < 0) throw new Error('Price must be >= 0');
    if (this.stock < 0) throw new Error('Stock must be >= 0');
  }

  static create(
    id: string,
    name: string,
    sku: string,
    price: number,
    stock: number,
  ): Product {
    return new Product(id, name, sku, price, stock);
  }

  updateStock(newStock: number) {
    if (newStock < 0) throw new Error('Stock must be >= 0');
    this.stock = newStock;
    this.isActive = this.stock > 0;
  }
}
