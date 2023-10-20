import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
  query,
  collection,
  onSnapshot,
  addDoc,
  doc,
  where,
  deleteDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { MdOutlineRemoveCircle } from 'react-icons/md';
import { GrEdit } from 'react-icons/gr';
const Account = () => {
  const { user, logout } = UserAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [createFormData, setCreateFormData] = useState({
    service: '',
    cost: '',
    startDate: '',
    renewalDate: '',
    notes: '',
  });
  const [editFormData, setEditFormData] = useState(null);
  const [editingSubscriptionId, setEditingSubscriptionID] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('You are logged out');
    } catch (e) {
      console.log(e.message);
    }
  };
  // Read subscription from Firebase
  useEffect(() => {
    const q = query(collection(db, 'subscriptions'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let subscriptionsArr = [];
      querySnapshot.forEach((sub) => {
        subscriptionsArr.push({ ...sub.data(), id: sub.id });
      });
      setSubscriptions(subscriptionsArr);
    });
    return () => unsubscribe;
  }, []);

  // Create subscription in Firebase

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createSubscription = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'subscriptions'), {
        userID: user.uid,
        service: createFormData.service,
        cost: parseFloat(createFormData.cost),
        startDate: new Date(createFormData.startDate),
        renewalDate: new Date(createFormData.renewalDate),
        notes: createFormData.notes,
      });
      setCreateFormData({
        service: '',
        cost: '',
        startDate: '',
        renewalDate: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  // Update subscription from Firebase
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // start editing function
  const startEditing = (subscription) => {
    setEditFormData({
      service: subscription.service,
      cost: subscription.cost,
      startDate: subscription.startDate.toDate().toISOString().split('T')[0],
      renewalDate: subscription.renewalDate.toDate().toISOString().split('T')[0],
      notes: subscription.notes,
    });
    setEditingSubscriptionID(subscription.id);
  };
  // update firebase function

  const updateSubscription = async () => {
    if (editingSubscriptionId) {
      const subscriptionRef = doc(db, 'subscriptions', editingSubscriptionId);
      await updateDoc(subscriptionRef, {
        service: editFormData.service,
        cost: parseFloat(editFormData.cost),
        startDate: new Date(editFormData.startDate),
        renewalDate: new Date(editFormData.renewalDate),
        notes: editFormData.notes,
      });
      setEditingSubscriptionID(null);
      setEditFormData(null);
    }
  };

  // Delete subscription from Firebase
  const deleteSubscription = async (id) => {
    await deleteDoc(doc(db, 'subscriptions', id));
  };

  return (
    <div className='max-w-[600px] mx-auto my-16 p-4'>
      <h1 className='text-2xl font-bold py-4'>Account</h1>
      <p>User Email:{user && user.email}</p>
      <button onClick={handleLogout} className='border px-6 py-2 my-4 '>
        Logout
      </button>
      <form
        onSubmit={createSubscription}
        className='m-4 flex-col justify-between'
      >
        <input
          value={createFormData.service}
          onChange={handleInputChange}
          className='border p-2 w-full text-xl'
          type='text'
          placeholder='Enter new service name'
          name='service'
        />
        <input
          value={createFormData.cost}
          onChange={handleInputChange}
          className='border p-2 w-full text-xl'
          type='number'
          placeholder='Enter subscription cost'
          name='cost'
        />
        <input
          value={createFormData.startDate}
          onChange={handleInputChange}
          className='border p-2 w-full text-xl'
          type='date'
          placeholder='Enter new service name'
          name='startDate'
        />
        <input
          value={createFormData.renewalDate}
          onChange={handleInputChange}
          className='border p-2 w-full text-xl'
          type='date'
          placeholder='Enter new service name'
          name='renewalDate'
        />
        <input
          value={createFormData.notes}
          onChange={handleInputChange}
          className='border p-2 w-full text-xl'
          type='text'
          placeholder='Add some notes...'
          name='notes'
        />
        <button
          className='border p-4 ml-2 mt-2 bg-purple-500 text-slate-100'
          type='submit'
        >
          Add New Subscription
        </button>
      </form>
      {subscriptions.map((subscription) => {
        const dateString = subscription.renewalDate.toDate().toDateString();
        const isEditingThisSubscription =
          editingSubscriptionId === subscription.id;
        return (
          <li
            key={subscription.id}
            className='flex justify-between bg-green-500 p-4 my-2 capitalize rounded-3xl'
          >
            <div className='flex '>
              <p className='ml-2 cursor-pointer'>
                Subscription: {subscription.service}
              </p>
              <p className='ml-2 cursor-pointer'>$ {subscription.cost}</p>
            </div>
            <p className='ml-2 cursor-pointer '> Renew Date: {dateString}</p>
            <button onClick={() => deleteSubscription(subscription.id)}>
              <MdOutlineRemoveCircle size={30} />
            </button>
            <button onClick={() => startEditing(subscription)}>
              <GrEdit size={30} />
            </button>
            {isEditingThisSubscription && (
              <div>
                <h3>Edit Subscription</h3>
                <input
                  value={editFormData.service}
                  onChange={handleEditInputChange}
                  className='border p-2 w-full text-xl'
                  type='text'
                  placeholder='Enter new service name'
                  name='service'
                />
                <input
                  value={editFormData.cost}
                  onChange={handleEditInputChange}
                  className='border p-2 w-full text-xl'
                  type='number'
                  placeholder='Enter subscription cost'
                  name='cost'
                />
                <input
                  value={editFormData.startDate}
                  onChange={handleEditInputChange}
                  className='border p-2 w-full text-xl'
                  type='date'
                  placeholder='Enter new service name'
                  name='startDate'
                />
                <input
                  value={editFormData.renewalDate}
                  onChange={handleEditInputChange}
                  className='border p-2 w-full text-xl'
                  type='date'
                  placeholder='Enter new service name'
                  name='renewalDate'
                />
                <input
                  value={editFormData.notes}
                  onChange={handleEditInputChange}
                  className='border p-2 w-full text-xl'
                  type='text'
                  placeholder='Add some notes...'
                  name='notes'
                />
                <button
                  className='border p-4 ml-2 mt-2 bg-purple-500 text-slate-100'
                  onClick={() => updateSubscription(subscription.id)}
                >
                  Add New Subscription
                </button>
              </div>
            )}
          </li>
        );
      })}
    </div>
  );
};

export default Account;
