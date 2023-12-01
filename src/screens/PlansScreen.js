
import { addDoc, collection, doc, getDoc, getDocs, getDocsFromServer, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import db from '../firebase';
import './PlansScreen.css'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { loadStripe } from '@stripe/stripe-js';

function PlansScreen() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);

    const getSubscriptions = async () => {
        const custRef = doc(collection(db, "customers"), user.uid);
        const subsSnapshot = await getDocs(collection(custRef, "subscriptions"));
        subsSnapshot.forEach(async (subscription) => {
            setSubscription({
                role: subscription.data().role,
                current_period_end: subscription.data().current_period_end.seconds,
                current_period_start: subscription.data().current_period_start.seconds,
            })
        });
    }
    useEffect(() => {
        getSubscriptions();

    }, [user.uid]);



    const getProducts = async () => {

        const productsQuery = query(collection(db, "products"), where("active", "==", true));
        const querySnapshot = await getDocs(productsQuery);

        querySnapshot.forEach(async (doc) => {
            products[doc.id] = doc.data();
            const priceSnap = await getDocs(query(collection(doc.ref, "prices")));
            priceSnap.forEach((price) => {
                products[doc.id].prices = {
                    priceID: price.id,
                    priceData: price.data(),
                };
            });
        });

        setProducts(products);
        setLoading(false);
        // const productsQuery = query(collection(db, "products"), where("active", "==", true));
        // const querySnapshot = await getDocs(productsQuery);

        // const updatedProducts = {};

        // await Promise.all(querySnapshot.docs.map(async (doc) => {
        //     const productData = doc.data();
        //     const priceSnap = await getDocs(collection(doc.ref, "prices"));

        //     const prices = priceSnap.docs.map(price => ({
        //         priceID: price.id,
        //         priceData: price.data(),
        //     }));

        //     updatedProducts[doc.id] = { ...productData, prices };
        //     setProducts(updatedProducts);
        //     console.log(updatedProducts);
    };


    useEffect(() => {
        getProducts();
    }, []);

    const loadCheckout = async (priceID) => {
        const userRef = await doc(collection(db, "customers"), user.uid);
        const checkoutRef = await collection(userRef, "checkout_sessions");
        const docRef = await addDoc(checkoutRef, {
            price: priceID,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
        });


        const docSnapshot = await getDocsFromServer(checkoutRef);

        docSnapshot.forEach(async (snap) => {

            const data = snap.data();

            const { error, sessionId } = data;

            if (error) {
                alert(`An error occurred: ${error.message}`);
            }
            if (sessionId) {
                const stripe = await loadStripe('pk_test_51OFr7eAAF2scDV5uqjaIfI4LcSUwfk6fClOclHyxbxo1G6QdsPcuPUWcsuVx1q4LyJTRezr7IWz5ItiKruWXCkWB00CjRtkMP2');
                stripe.redirectToCheckout({ sessionId });
            }
        })


            ;



        // onSnapshot(checkoutRef, async (snap) => {
        //     snap.forEach(async (doc) => {
        //         const { error, sessionId } = doc.data();
        //         console.log('sessionId: ', sessionId);
        //         console.log('error: ', error);
        //         if (error) {
        //             alert(`An error occurred: ${error.message}`);
        //         }
        //         if (sessionId) {
        //             const stripe = await loadStripe('pk_test_51OFr7eAAF2scDV5uqjaIfI4LcSUwfk6fClOclHyxbxo1G6QdsPcuPUWcsuVx1q4LyJTRezr7IWz5ItiKruWXCkWB00CjRtkMP2');

        //             stripe.redirectToCheckout({ sessionId });
        //         }
        //     });
        // })


    };


    return (
        <div className='plansScreen'>
            <br />
            {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
            {loading ? <p>Loading...</p> : Object.entries(products).map(([productId, productData]) => {
                const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);
                return (
                    <div className={`${isCurrentPackage && "plansScreen__plan--disabled"} plansScreen__plan`} key={productId}>
                        <div className='plansScreen__info'>
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>

                        <button onClick={() => !isCurrentPackage && loadCheckout(productData?.prices?.priceID)}>{isCurrentPackage ? "Current Package" : "Subscribe"}</button>
                    </div>

                );
            })}
        </div>
    )
}


export default PlansScreen;

