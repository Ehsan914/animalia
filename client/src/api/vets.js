import axiosInstance from "./axiosInstance";

// VET FUNCTIONS
export const getVets = async () => {
    try {
        const response = await axiosInstance.get('/vets');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch vets';
        throw message;
    }
}

export const createVet = async (vetData) => {
    try {
        const response = await axiosInstance.post('/vets', vetData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create vet';
        throw message;
    }
}

export const updateVet = async (id, vetData) => {
    try {
        const response = await axiosInstance.put(`/vets/${id}`, vetData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update vet';
        throw message;
    }
}

export const deleteVet = async (id) => {
    try {
        const response = await axiosInstance.delete(`/vets/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete vet';
        throw message;
    }
}

export const reorderVets = async (items) => {
    try {
        const response = await axiosInstance.put('/vets/reorder', { items });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to reorder vets';
        throw message;
    }
}

// SPECIALITY FUNCTIONS
export const getSpecialities = async () => {
    try {
        const response = await axiosInstance.get('/specialities');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch specialities';
        throw message;
    }
}

export const createSpeciality = async (name) => {
    try {
        const response = await axiosInstance.post('/specialities', { name });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create speciality';
        throw message;
    }
}

export const updateSpeciality = async (id, name) => {
    try {
        const response = await axiosInstance.put(`/specialities/${id}`, { name });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update speciality';
        throw message;
    }
}

export const deleteSpeciality = async (id) => {
    try {
        const response = await axiosInstance.delete(`/specialities/${id}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete speciality';
        throw message;
    }
}
