const PlantImage = require('../models/PlantImage');
const Plant = require('../models/Plant');
const { successResponse, errorResponse } = require('../utils/response');

class ImageController {
  async upload(req, res) {
    try {
      const userId = req.user.id;
      const { plantId } = req.params;
      const files = req.files;
      const { caption, is_primary: isPrimary } = req.body;

      if (!files || files.length === 0) {
        return errorResponse(res, 'Tidak ada file yang diupload', 400);
      }

      const plant = await Plant.findById(plantId, userId);
      if (!plant) {
        return errorResponse(res, 'Tanaman tidak ditemukan', 404);
      }

      const uploadedImages = [];

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];

        const storageData = await PlantImage.uploadToStorage(userId, plantId, file);

        const existingImages = await PlantImage.findByPlantId(plantId, userId);
        const maxOrder = existingImages.length > 0
          ? Math.max(...existingImages.map((img) => img.display_order))
          : -1;

        const imageData = {
          storage_path: storageData.storage_path,
          image_url: storageData.image_url,
          caption: caption || null,
          is_primary: i === 0
            && (isPrimary === 'true' || isPrimary === true)
            && existingImages.length === 0,
          display_order: maxOrder + 1 + i
        };

        const image = await PlantImage.create(userId, plantId, imageData);
        uploadedImages.push(image);
      }

      return successResponse(
        res,
        `${uploadedImages.length} gambar berhasil diupload`,
        { images: uploadedImages },
        201
      );
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getByPlantId(req, res) {
    try {
      const userId = req.user.id;
      const { plantId } = req.params;

      const plant = await Plant.findById(plantId, userId);
      if (!plant) {
        return errorResponse(res, 'Tanaman tidak ditemukan', 404);
      }

      const images = await PlantImage.findByPlantId(plantId, userId);

      return successResponse(res, 'Daftar gambar berhasil diambil', { images });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async update(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const image = await PlantImage.update(id, userId, updateData);

      if (!image) {
        return errorResponse(res, 'Gambar tidak ditemukan', 404);
      }

      return successResponse(res, 'Gambar berhasil diperbarui', { image });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async delete(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await PlantImage.delete(id, userId);

      return successResponse(res, 'Gambar berhasil dihapus');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async setPrimary(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const imageData = await PlantImage.findById(id, userId);

      if (!imageData) {
        return errorResponse(res, 'Gambar tidak ditemukan', 404);
      }

      const image = await PlantImage.setPrimary(id, imageData.plant_id, userId);

      return successResponse(res, 'Gambar utama berhasil diatur', { image });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async reorder(req, res) {
    try {
      const userId = req.user.id;
      const { plantId } = req.params;
      const { image_orders: imageOrders } = req.body;

      if (!Array.isArray(imageOrders) || imageOrders.length === 0) {
        return errorResponse(res, 'Data urutan gambar tidak valid', 400);
      }

      const plant = await Plant.findById(plantId, userId);
      if (!plant) {
        return errorResponse(res, 'Tanaman tidak ditemukan', 404);
      }

      const updatedImages = [];

      for (const item of imageOrders) {
        const image = await PlantImage.update(item.id, userId, {
          display_order: item.display_order
        });
        updatedImages.push(image);
      }

      return successResponse(
        res,
        'Urutan gambar berhasil diperbarui',
        { images: updatedImages }
      );
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new ImageController();

