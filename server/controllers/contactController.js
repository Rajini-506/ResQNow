import mongoose from 'mongoose';
import EmergencyContact from '../models/EmergencyContact.js';

// Fallback in-memory contacts
let memoryContacts = [
  {
    id: 'contact-demo-1',
    _id: 'contact-demo-1',
    userId: '507f1f77bcf86cd799439011',
    name: 'Elena Morgan (Mother)',
    relationship: 'Parent',
    phone: '+1 (555) 432-8765',
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: 'contact-demo-2',
    _id: 'contact-demo-2',
    userId: '507f1f77bcf86cd799439011',
    name: 'Dr. Raymond Scott (Cardiologist)',
    relationship: 'Physician / Caretaker',
    phone: '+1 (555) 889-2104',
    isPrimary: false,
    createdAt: new Date(),
  },
];

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const contacts = await EmergencyContact.find({ userId }).sort({ isPrimary: -1, createdAt: -1 });
        const formatted = contacts.map((c) => ({
          id: c._id.toString(),
          _id: c._id.toString(),
          userId: c.userId.toString(),
          name: c.name,
          relationship: c.relationship,
          phone: c.phone,
          isPrimary: c.isPrimary,
          createdAt: c.createdAt,
        }));
        return res.json({ success: true, count: formatted.length, contacts: formatted });
      } catch (dbErr) {
        // Fall back below
      }
    }

    const userList = memoryContacts.filter((c) => c.userId === userId || c.userId === '507f1f77bcf86cd799439011');
    return res.json({ success: true, count: userList.length, contacts: userList });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, relationship, phone, isPrimary } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Contact name and phone number are required.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        if (isPrimary) {
          await EmergencyContact.updateMany({ userId }, { isPrimary: false });
        }

        const contact = await EmergencyContact.create({
          userId,
          name,
          relationship: relationship || 'Family / Partner',
          phone,
          isPrimary: Boolean(isPrimary),
        });

        return res.status(201).json({
          success: true,
          contact: {
            id: contact._id.toString(),
            _id: contact._id.toString(),
            userId: contact.userId.toString(),
            name: contact.name,
            relationship: contact.relationship,
            phone: contact.phone,
            isPrimary: contact.isPrimary,
            createdAt: contact.createdAt,
          },
        });
      } catch (dbErr) {
        // Fall back below
      }
    }

    const newId = `contact-${Date.now()}`;
    if (isPrimary) {
      memoryContacts.forEach((c) => {
        if (c.userId === userId) c.isPrimary = false;
      });
    }

    const fallback = {
      id: newId,
      _id: newId,
      userId,
      name,
      relationship: relationship || 'Family / Partner',
      phone,
      isPrimary: Boolean(isPrimary),
      createdAt: new Date(),
    };
    memoryContacts.unshift(fallback);

    return res.status(201).json({ success: true, contact: fallback });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, relationship, phone, isPrimary } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        if (isPrimary) {
          await EmergencyContact.updateMany({ userId }, { isPrimary: false });
        }

        const contact = await EmergencyContact.findById(id);
        if (contact) {
          if (name) contact.name = name;
          if (relationship) contact.relationship = relationship;
          if (phone) contact.phone = phone;
          if (isPrimary !== undefined) contact.isPrimary = Boolean(isPrimary);

          const updated = await contact.save();
          return res.json({
            success: true,
            contact: {
              id: updated._id.toString(),
              _id: updated._id.toString(),
              userId: updated.userId.toString(),
              name: updated.name,
              relationship: updated.relationship,
              phone: updated.phone,
              isPrimary: updated.isPrimary,
              createdAt: updated.createdAt,
            },
          });
        }
      } catch (dbErr) {
        // Fall back below
      }
    }

    const index = memoryContacts.findIndex((c) => c.id === id || c._id === id);
    if (index !== -1) {
      if (isPrimary) {
        memoryContacts.forEach((c) => {
          if (c.userId === userId) c.isPrimary = false;
        });
      }
      const updated = {
        ...memoryContacts[index],
        name: name || memoryContacts[index].name,
        relationship: relationship || memoryContacts[index].relationship,
        phone: phone || memoryContacts[index].phone,
        isPrimary: isPrimary !== undefined ? Boolean(isPrimary) : memoryContacts[index].isPrimary,
      };
      memoryContacts[index] = updated;
      return res.json({ success: true, contact: updated });
    }

    return res.status(404).json({ success: false, message: 'Contact not found.' });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        await EmergencyContact.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Contact removed successfully.' });
      } catch (dbErr) {
        // Fall back below
      }
    }

    memoryContacts = memoryContacts.filter((c) => c.id !== id && c._id !== id);
    return res.json({ success: true, message: 'Contact removed successfully.' });
  } catch (error) {
    next(error);
  }
};

export default {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
