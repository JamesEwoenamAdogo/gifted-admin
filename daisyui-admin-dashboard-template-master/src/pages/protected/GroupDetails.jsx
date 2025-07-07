import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GroupDetailsPage() {
  const [groupData, setGroupData] = useState(null);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('groupDetails');
    if (data) {
      try {
        setGroupData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse groupDetails:", e);
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setGroupData((prev) => ({ ...prev, [field]: value }));
  };

  const saveField = async() => {
    localStorage.setItem('groupDetails', JSON.stringify(groupData));
    const response = await axios.post(`/update-group/${groupData._id}`,groupData)
    console.log(response)
    setEditingField(null);
  };

  if (!groupData) return <div className="p-4">Loading group details...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Group Details</h1>

      {/* Group Name */}
      <div className="mb-4">
        <strong>Name:</strong>{' '}
        {editingField === 'name' ? (
          <>
            <input
              value={groupData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="border p-1 rounded ml-2"
            />
            <button onClick={saveField} className="ml-2 text-green-600">Save</button>
          </>
        ) : (
          <>
            <span>{groupData.name}</span>
            <button onClick={() => setEditingField('name')} className="ml-2 text-blue-600">Edit</button>
          </>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <strong>Description:</strong>{' '}
        {editingField === 'description' ? (
          <>
            <input
              value={groupData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border p-1 rounded ml-2 w-full"
            />
            <button onClick={saveField} className="mt-2 text-green-600">Save</button>
          </>
        ) : (
          <>
            <span>{groupData.description}</span>
            <button onClick={() => setEditingField('description')} className="ml-2 text-blue-600">Edit</button>
          </>
        )}
      </div>

      {/* Image */}
      <div className="mb-4">
        <strong>Image:</strong>
        {editingField === 'image' ? (
          <>
            <input
              value={groupData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className="border p-1 rounded ml-2 w-full"
            />
            <button onClick={saveField} className="mt-2 text-green-600">Save</button>
          </>
        ) : (
          <div className="flex items-center gap-4 mt-2">
            <img src={groupData.image} alt="Group" className="w-32 h-32 object-cover rounded" />
            <button onClick={() => setEditingField('image')} className="text-blue-600">Edit</button>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-4">
        <strong>Category:</strong>{' '}
        {editingField === 'category' ? (
          <>
            <input
              value={groupData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="border p-1 rounded ml-2"
            />
            <button onClick={saveField} className="ml-2 text-green-600">Save</button>
          </>
        ) : (
          <>
            <span>{groupData.category}</span>
            <button onClick={() => setEditingField('category')} className="ml-2 text-blue-600">Edit</button>
          </>
        )}
      </div>

      {/* isOpen */}
      <div className="mb-4">
        <strong>Is Open:</strong>{' '}
        {editingField === 'isOpen' ? (
          <>
            <input
              type="checkbox"
              checked={groupData.isOpen}
              onChange={(e) => handleChange('isOpen', e.target.checked)}
              className="ml-2"
            />
            <button onClick={saveField} className="ml-2 text-green-600">Save</button>
          </>
        ) : (
          <>
            <span>{groupData.isOpen ? 'Yes' : 'No'}</span>
            <button onClick={() => setEditingField('isOpen')} className="ml-2 text-blue-600">Edit</button>
          </>
        )}
      </div>
    </div>
  );
}
