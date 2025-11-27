const { supabase } = require('../config/database');

class Plant {
  static async create(userId, plantData) {
    const { data, error } = await supabase
      .from('plants')
      .insert([{
        user_id: userId,
        ...plantData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(plantId, userId) {
    const { data, error } = await supabase
      .from('plants')
      .select(`
        *,
        plant_images (
          id,
          storage_path,
          image_url,
          caption,
          is_primary,
          display_order,
          created_at
        )
      `)
      .eq('id', plantId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async findAll(userId, filters = {}) {
    let query = supabase
      .from('plants')
      .select(`
        *,
        plant_images!left (
          id,
          image_url,
          is_primary
        )
      `, { count: 'exact' })
      .eq('user_id', userId);

    if (filters.plant_type) {
      query = query.eq('plant_type', filters.plant_type);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`plant_name.ilike.%${filters.search}%,scientific_name.ilike.%${filters.search}%`);
    }

    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  static async update(plantId, userId, updateData) {
    const { data, error } = await supabase
      .from('plants')
      .update(updateData)
      .eq('id', plantId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(plantId, userId) {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', plantId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  static async getStatistics(userId) {
    const { data, error } = await supabase
      .from('plants')
      .select('plant_type, status')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      by_type: {},
      by_status: {}
    };

    data.forEach((plant) => {
      stats.by_type[plant.plant_type] = (stats.by_type[plant.plant_type] || 0) + 1;
      stats.by_status[plant.status] = (stats.by_status[plant.status] || 0) + 1;
    });

    return stats;
  }
}

module.exports = Plant;

