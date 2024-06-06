import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from '@/services/firebase';
import productService from '@/services/product';

const useProduct = (typeProduct ,id) => {
  // get and check if product exists in store
  const storeProduct = useSelector((state) => state.products.items.find((item) => item.id === id));

  const [product, setProduct] = useState(storeProduct);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  useEffect(() => {
    (async () => {
      try {
        if (!product || product.id !== id) {
          setLoading(true);
          let doc = null;
          if (typeProduct === 'book'){
            doc = await productService.getSingleBook(id);
          }
          else if(typeProduct === 'mobile'){
            doc = await productService.getSingleMobile(id);
          }
          if (doc.data) {
            const data = { ...doc.data};

            if (didMount) {
              setProduct(data);
              setLoading(false);
            }
          } else {
            setError('Product not found.');
          }
        }
      } catch (err) {
        if (didMount) {
          setLoading(false);
          setError(err?.message || 'Something went wrong.');
        }
      }
    })();
  }, [id]);

  return { product, isLoading, error };
};

export default useProduct;
