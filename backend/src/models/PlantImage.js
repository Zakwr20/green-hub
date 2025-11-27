const { supabase } = require('../config/database');
const config = require('../config/env');

class PlantImage {
  static async create(userId, plantId, imageData) {
    const { data, error } = await supabase
      .from('plant_images')
      .insert([{
        user_id: userId,
        plant_id: plantId,
        ...imageData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByPlantId(plantId, userId) {
    const { data, error } = await supabase
      .from('plant_images')
      .select('*')
      .eq('plant_id', plantId)
      .eq('user_id', userId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async findById(imageId, userId) {
    const { data, error } = await supabase
      .from('plant_images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(imageId, userId, updateData) {
    const { data, error } = await supabase
      .from('plant_images')
      .update(updateData)
      .eq('id', imageId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(imageId, userId) {
    const image = await this.findById(imageId, userId);

    const { error: storageError } = await supabase.storage
      .from(config.storage.bucketName)
      .remove([image.storage_path]);

    if (storageError) throw storageError;

    const { error } = await supabase
      .from('plant_images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  static async setPrimary(imageId, plantId, userId) {
    await supabase
      .from('plant_images')
      .update({ is_primary: false })
      .eq('plant_id', plantId)
      .eq('user_id', userId);

    const { data, error } = await supabase
      .from('plant_images')
      .update({ is_primary: true })
      .eq('id', imageId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async uploadToStorage(userId, plantId, file) {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${plantId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(config.storage.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(config.storage.bucketName)
      .getPublicUrl(filePath);

    return {
      storage_path: filePath,
      image_url: publicUrl
    };
  }
}

module.exports = PlantImage;

