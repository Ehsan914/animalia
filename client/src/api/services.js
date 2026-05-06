import axiosInstance from "./axiosInstance";

export const getServices = async () => {
    try {
        const response = await axiosInstance.get('/services');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch services';
        throw message;
    }
}

export const createService = async (serviceData) => {
    try {
        const response = await axiosInstance.post('/services', serviceData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create service';
        throw message;
    }
}

export const updateService = async (id, serviceData) => {
    try {
        const response = await axiosInstance.put(`/services/${id}`, serviceData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update service';
        throw message;
    }
}

export const deleteService = async (id) => {
    try {
        const response = await axiosInstance.delete(`/services/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete service';
        throw message;
    }
}

export const reorderServices = async (items) => {
    try {
        const response = await axiosInstance.put('/services/reorder', { items });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to reorder services';
        throw message;
    }
}