const { body, param, query } = require('express-validator');

const plantValidation = {
  create: [
    body('plant_name')
      .trim()
      .notEmpty()
      .withMessage('Nama tanaman harus diisi')
      .isLength({ min: 2, max: 200 })
      .withMessage('Nama tanaman harus antara 2-200 karakter'),
    body('plant_type')
      .notEmpty()
      .withMessage('Tipe tanaman harus diisi')
      .isIn(['herba', 'semak', 'pohon', 'pemanjat', 'menjalar'])
      .withMessage('Tipe tanaman tidak valid'),
    body('scientific_name')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Nama ilmiah maksimal 200 karakter'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Deskripsi maksimal 1000 karakter'),
    body('location')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Lokasi maksimal 200 karakter'),
    body('acquisition_date')
      .optional()
      .isISO8601()
      .withMessage('Format tanggal tidak valid'),
    body('status')
      .optional()
      .isIn(['hidup', 'mati', 'sakit', 'berbunga'])
      .withMessage('Status tanaman tidak valid'),
    body('preferred_lighting')
      .optional()
      .isIn(['full_sun', 'partial_sun', 'indirect_light', 'low_light'])
      .withMessage('Preferensi cahaya tidak valid'),
    body('preferred_humidity')
      .optional()
      .isIn(['dry', 'normal', 'humid'])
      .withMessage('Preferensi kelembapan tidak valid'),
    body('preferred_temperature')
      .optional()
      .isIn(['cool', 'moderate', 'warm'])
      .withMessage('Preferensi suhu tidak valid'),
    body('care_instructions')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Petunjuk perawatan maksimal 1000 karakter')
  ],
  update: [
    param('id')
      .isUUID()
      .withMessage('ID tanaman tidak valid'),
    body('plant_name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Nama tanaman tidak boleh kosong')
      .isLength({ min: 2, max: 200 })
      .withMessage('Nama tanaman harus antara 2-200 karakter'),
    body('plant_type')
      .optional()
      .isIn(['herba', 'semak', 'pohon', 'pemanjat', 'menjalar'])
      .withMessage('Tipe tanaman tidak valid'),
    body('status')
      .optional()
      .isIn(['hidup', 'mati', 'sakit', 'berbunga'])
      .withMessage('Status tanaman tidak valid'),
    body('preferred_lighting')
      .optional()
      .isIn(['full_sun', 'partial_sun', 'indirect_light', 'low_light'])
      .withMessage('Preferensi cahaya tidak valid'),
    body('preferred_humidity')
      .optional()
      .isIn(['dry', 'normal', 'humid'])
      .withMessage('Preferensi kelembapan tidak valid'),
    body('preferred_temperature')
      .optional()
      .isIn(['cool', 'moderate', 'warm'])
      .withMessage('Preferensi suhu tidak valid')
  ],
  getById: [
    param('id')
      .isUUID()
      .withMessage('ID tanaman tidak valid')
  ],
  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page harus berupa angka positif'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit harus antara 1-100'),
    query('plant_type')
      .optional()
      .isIn(['herba', 'semak', 'pohon', 'pemanjat', 'menjalar'])
      .withMessage('Tipe tanaman tidak valid'),
    query('status')
      .optional()
      .isIn(['hidup', 'mati', 'sakit', 'berbunga'])
      .withMessage('Status tanaman tidak valid')
  ]
};

const imageValidation = {
  upload: [
    param('plantId')
      .isUUID()
      .withMessage('ID tanaman tidak valid'),
    body('caption')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Keterangan maksimal 200 karakter'),
    body('is_primary')
      .optional()
      .isBoolean()
      .withMessage('is_primary harus berupa boolean')
  ],
  delete: [
    param('id')
      .isUUID()
      .withMessage('ID gambar tidak valid')
  ]
};

module.exports = {
  plantValidation,
  imageValidation
};
