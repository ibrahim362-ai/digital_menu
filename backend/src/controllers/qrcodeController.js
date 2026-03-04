import prisma from '../config/database.js';
import QRCode from 'qrcode';

export const getQRCodes = async (req, res) => {
  try {
    const qrcodes = await prisma.qRCode.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(qrcodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
};

export const createQRCode = async (req, res) => {
  try {
    const { name, url, description } = req.body;
    const qrCodeData = await QRCode.toDataURL(url, { width: 300, margin: 2 });
    
    const qrcode = await prisma.qRCode.create({
      data: { name, url, qrCodeData, description }
    });
    res.json(qrcode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create QR code' });
  }
};

export const updateQRCode = async (req, res) => {
  try {
    const { name, url, description } = req.body;
    const qrCodeData = await QRCode.toDataURL(url, { width: 300, margin: 2 });
    
    const qrcode = await prisma.qRCode.update({
      where: { id: parseInt(req.params.id) },
      data: { name, url, qrCodeData, description }
    });
    res.json(qrcode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update QR code' });
  }
};

export const deleteQRCode = async (req, res) => {
  try {
    await prisma.qRCode.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'QR code deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete QR code' });
  }
};
