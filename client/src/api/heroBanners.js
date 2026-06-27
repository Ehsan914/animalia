import axiosInstance from "./axiosInstance";

// Public — returns the active hero banner within its date window, or null
export const getActiveHeroBanner = async () => {
    try {
        const response = await axiosInstance.get('/hero-banners');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch hero banner';
        throw message;
    }
}

export const getAllHeroBanners = async () => {
    try {
        const response = await axiosInstance.get('/hero-banners/admin');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch hero banners';
        throw message;
    }
}

export const createHeroBanner = async (data) => {
    try {
        const response = await axiosInstance.post('/hero-banners', data);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create hero banner';
        throw message;
    }
}

export const updateHeroBanner = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/hero-banners/${id}`, data);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update hero banner';
        throw message;
    }
}

export const deleteHeroBanner = async (id) => {
    try {
        const response = await axiosInstance.delete(`/hero-banners/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete hero banner';
        throw message;
    }
}
