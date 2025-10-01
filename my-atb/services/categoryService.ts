import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "@/utils/createBaseQuery";
import {ICategoryItem} from "@/interfaces/category/ICategoryItem";
import {ICategoryCreate} from "@/interfaces/category/ICategoryCreate";

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: createBaseQuery('categories'),
    tagTypes: ['Categories'],

    endpoints: (builder) => ({
        getCategories: builder.query<ICategoryItem[], void>({
            query: () => {
                return {
                    url: '',
                    method: 'GET'
                };
            },
            providesTags: ["Categories"]
        }),
        getCategoryById: builder.query<ICategoryItem, number>({
            query: (id) => ({
                url: `/${id}`,   // -> /api/categories/2
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Categories', id }]
        }),
        createCategory: builder.mutation<ICategoryItem, FormData>({
            query: (formData) =>({
                url: '',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Categories']
        })
    }),
})

export const {useGetCategoriesQuery, useGetCategoryByIdQuery, useCreateCategoryMutation} = categoryApi;