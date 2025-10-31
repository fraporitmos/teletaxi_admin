import axios from 'axios';

class RemoteService {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
  }
  async get(path, config) {
    try {
      const { data } = await this.client.get(path, config);
      
      if (path.includes("expand") && data.items) {
        data.items = data.items.map((item) => {
          const { expand, ...rest } = item;
          let flattenedExpand = {};
          if (expand) {
            Object.entries(expand).forEach(([_, value]) => {
              const entity = { ...value };
              delete entity.id;
              if (entity.expand) {
                Object.entries(entity.expand).forEach(([_, nested]) => {
                  const nestedEntity = { ...nested };
                  delete nestedEntity.id;
                  Object.assign(entity, nestedEntity);
                });
                delete entity.expand;
              }
              Object.assign(flattenedExpand, entity);
            });
          }
          return {
            ...rest,
            ...flattenedExpand,
          };
        });
      }
      
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(path, payload, config) {
    try {
      const { data } = await this.client.post(path, payload, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(path, payload, config) {
    try {
      const { data } = await this.client.put(path, payload, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(path, payload, config) {
    try {
      const { data } = await this.client.patch(path, payload, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(path, config) {
    try {
      const { data } = await this.client.delete(path, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Request failed with status ${status}: ${JSON.stringify(data)}`);
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error(error.message);
    }
  }
}

// Cambia el URL base según tu API
export default new RemoteService( import.meta.env.VITE_API_POCKET_URL);
