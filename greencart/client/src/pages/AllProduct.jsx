import React from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'

const AllProduct = () => {
    const { category } = useParams();
    const context = useAppContext();
    
    // Safety check to prevent crash if context is missing
    if (!context) {
        return <div className='mt-16 text-center text-gray-500'>Loading...</div>;
    }

    const { products, searchQuery, navigate } = context;

    // Derived state: calculate filtered products during render
    const filteredproducts = products.filter(product => {
        // Category filter
        if (category) {
            const productCat = Array.isArray(product.category) ? product.category[0] : product.category;
            if (!(productCat && productCat.toLowerCase() === category.toLowerCase())) return false;
        }
        
        // Search filter
        if (searchQuery.length > 0) {
            if (!product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        }
        
        return true;
    });

    const inStockProducts = filteredproducts.filter(product => product.instock);

    // Find the proper category title from assets
    const categoryData = categories.find(c => c.path.toLowerCase() === (category || '').toLowerCase());
    const displayCategory = categoryData ? categoryData.text : category;

    return (
        <div className='mt-16 flex flex-col items-center gap-5 pb-14'>
            <div className='flex flex-col items-end w-max self-start'>
                <p className='text-2xl font-medium uppercase'>{displayCategory ? displayCategory : "ALL Products"}</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 w-full'>
                {inStockProducts.length > 0 ? (
                    inStockProducts.map((product, index) => (
                        <ProductCard key={product._id || index} product={product} />
                    ))
                ) : (
                    <div className='col-span-full py-20 text-center text-gray-400'>
                        No products found in this category.
                    </div>
                )}
            </div>
            
            {category && (
                <button 
                    onClick={() => { navigate('/products'); scrollTo(0,0); }} 
                    className='mt-8 px-8 py-2.5 bg-primary text-white rounded hover:bg-primary/90 transition'>
                    See more
                </button>
            )}
        </div>
    )
}

export default AllProduct
