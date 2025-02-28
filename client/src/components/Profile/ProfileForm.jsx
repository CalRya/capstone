import React, { useState } from 'react';
import '../CSS FOLDER/ProfileForm.css'

const ProfileForm = () => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [section, setSection] = useState('');
  const [adviser, setAdviser] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      genre,
      gender,
      address,
      contact,
      section,
      adviser,
    });
    alert('Profile saved!');
  };

  return (
    <div className="form-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label>Genre:</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
            <option value="">Select Genre</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Horror">Horror</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
          </select>
        </div>

        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            required
          />
        </div>

        <div>
          <label>Contact No:</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter your contact number"
            required
          />
        </div>

        <div>
          <label>Section:</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Enter your section"
            required
          />
        </div>

        <div>
          <label>Adviser:</label>
          <input
            type="text"
            value={adviser}
            onChange={(e) => setAdviser(e.target.value)}
            placeholder="Enter your adviser's name"
            required
          />
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
