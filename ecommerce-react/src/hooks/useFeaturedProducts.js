import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import firebase from '@/services/firebase';
import productService from '@/services/product';

const useFeaturedProducts = (itemsCount) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const docs = await productService.fetchBooks();
      // console.log(docs)
      if (docs.empty) {
        if (didMount) {
          setError('No featured products found.');
          setLoading(false);
        }
      } else {
        const items = [];

        docs.data.forEach((data) => {
          items.push({ id: data.id, ...data });
        });

        if (didMount) {
          setFeaturedProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        console.log(e)
        setError('Failed to fetch featured products');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (featuredProducts.length === 0 && didMount) {
      fetchFeaturedProducts();
    }
  }, []);

  return {
    featuredProducts, fetchFeaturedProducts, isLoading, error
  };
};

export default useFeaturedProducts;
