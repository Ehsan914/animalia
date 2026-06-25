import axiosInstance from "./axiosInstance";

// Public — returns the active banner object, or null
export const getActiveBanner = async () => {
    try {
        const response = await axiosInstance.get('/banners');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch banner';
        throw message;
    }
}

export const getAllBanners = async () => {
    try {
        const response = await axiosInstance.get('/banners/admin');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch banners';
        throw message;
    }
}

export const createBanner = async (bannerData) => {
    try {
        const response = await axiosInstance.post('/banners', bannerData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create banner';
        throw message;
    }
}

export const updateBanner = async (id, bannerData) => {
    try {
        const response = await axiosInstance.put(`/banners/${id}`, bannerData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update banner';
        throw message;
    }
}

export const deleteBanner = async (id) => {
    try {
        const response = await axiosInstance.delete(`/banners/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete banner';
        throw message;
    }
}
