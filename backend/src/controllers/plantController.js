const Plant = require('../models/Plant');
const { successResponse, errorResponse } = require('../utils/response');

class PlantController {
  async create(req, res) {
    try {
      const userId = req.user.id;
      const plantData = req.body;

      const plant = await Plant.create(userId, plantData);

      return successResponse(res, 'Tanaman berhasil ditambahkan', { plant }, 201);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        plant_type: req.query.plant_type,
        status: req.query.status,
        search: req.query.search,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order
      };

      const result = await Plant.findAll(userId, filters);

      return successResponse(res, 'Daftar tanaman berhasil diambil', result);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const plant = await Plant.findById(id, userId);

      if (!plant) {
        return errorResponse(res, 'Tanaman tidak ditemukan', 404);
      }

      return successResponse(res, 'Detail tanaman berhasil diambil', { plant });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async update(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      const plant = await Plant.update(id, userId, updateData);

      if (!plant) {
        return errorResponse(res, 'Tanaman tidak ditemukan', 404);
      }

      return successResponse(res, 'Tanaman berhasil diperbarui', { plant });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async delete(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await Plant.delete(id, userId);

      return successResponse(res, 'Tanaman berhasil dihapus');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getStatistics(req, res) {
    try {
      const userId = req.user.id;

      const stats = await Plant.getStatistics(userId);

      return successResponse(res, 'Statistik berhasil diambil', { stats });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new PlantController();

