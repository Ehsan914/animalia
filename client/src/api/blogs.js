import axiosInstance from "./axiosInstance";

export const getBlogs = async (lang = 'en') => {
    try {
        const response = await axiosInstance.get('/blogs', {params: {lang}});
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch blogs';
        throw message;
    }
}

export const getAllBlogs = async () => {
    try {
        const response = await axiosInstance.get('/blogs/admin');
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch all blogs';
        throw message;
    }
}

export const getBlogBySlug = async (slug, lang = 'en') => {
    try {
        const response = await axiosInstance.get(`/blogs/${slug}`, {params: {lang}});
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch blog by slug';
        throw message;
    }
}

export const createBlog = async (blogData) => {
    try {
        const response = await axiosInstance.post('/blogs', blogData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to create blog';
        throw message;
    }
}

export const updateBlog = async (slug, blogData) => {
    try {
        const response = await axiosInstance.put(`/blogs/${slug}`, blogData);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to update blog';
        throw message;
    }
}

export const deleteBlog = async (slug) => {
    try {
        const response = await axiosInstance.delete(`/blogs/${slug}`);
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete blog';
        throw message;
    }
}