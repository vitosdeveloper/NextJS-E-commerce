import PurchaseModal from '@/components/PurchaseModal';
import { useGlobalContext } from '@/context/GlobalContext';
import getHours from '@/utils/getHours';
import Router from 'next/router';
import { useState } from 'react';
import useFetch from '@/custom-hooks/useFetch';

const usePurchaseModal = (
  items: { _id: string; quantity: number }[],
  totalPrice: number
) => {
  const [modal, setModal] = useState<boolean>(false);
  const { data, loading, error, request } = useFetch();
  const { checkJwt } = useGlobalContext();

  const handleSubmitPurchase = async () => {
    try {
      if (await checkJwt()) {
        const token = window.localStorage.getItem('storeJwt');

        const { response, json } = await request(
          process.env.NEXT_PUBLIC_URL + '/api/post/processPurchases',
          {
            method: 'POST',
            body: JSON.stringify({
              purchaseDate: getHours(),
              items,
              token,
            }),
          }
        );
        if (response?.ok) {
          setModal(false);
          Router.push('/hist');
        } else throw new Error();
      } else throw new Error();
    } catch (err: any) {
      setModal(false);
    }
  };

  const ModalComponent = () =>
    modal && (
      <PurchaseModal
        handleSubmitPurchase={handleSubmitPurchase}
        setModal={setModal}
        totalPrice={totalPrice}
        loading={loading}
      />
    );
  return { ModalComponent, setModal, error };
};

export default usePurchaseModal;
