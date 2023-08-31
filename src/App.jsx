/* eslint-disable no-console */
import React, { useState } from 'react';
import './App.scss';
import cl from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const SEX_MALE = 'm';
const SEX_FEMALE = 'f';
const DEFAULT_VALUE_SORT_NAME = 'All';
const DEFAULT_VALUE_QUERY = '';

function findCategoryById(product) {
  return categoriesFromServer
    .find(category => category.id === product.categoryId);
}

function findUserById(category) {
  return usersFromServer.find(user => user.id === category.ownerId);
}

function getFilteredProductsByUserName(
  products,
  sortName,
  query,
) {
  let filteredProducts = [...products];

  if (sortName !== DEFAULT_VALUE_SORT_NAME) {
    filteredProducts = filteredProducts
      .filter(product => product.user.name === sortName);
  }

  if (query !== DEFAULT_VALUE_QUERY) {
    filteredProducts = filteredProducts
      .filter(product => product.name
        .toLowerCase()
        .includes(query.toLowerCase()));
  }

  return filteredProducts;
}

const products = productsFromServer.map((product) => {
  const category = findCategoryById(product);
  const user = findUserById(category);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [sortName, setSortName] = useState(DEFAULT_VALUE_SORT_NAME);
  const [query, setQuery] = useState(DEFAULT_VALUE_QUERY);

  const preparedProducts = getFilteredProductsByUserName(
    products,
    sortName,
    query,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cl(
                  { 'is-active': DEFAULT_VALUE_SORT_NAME === sortName },
                )}
                onClick={() => setSortName(DEFAULT_VALUE_SORT_NAME)}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { name, id } = user;

                return (
                  <a
                    key={id}
                    className={cl(
                      { 'is-active': name === sortName },
                    )}
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => setSortName(name)}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.currentTarget.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query !== DEFAULT_VALUE_QUERY
                    && (
                    <button
                      onClick={() => setQuery(DEFAULT_VALUE_QUERY)}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                    )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery(DEFAULT_VALUE_QUERY);
                  setSortName(DEFAULT_VALUE_SORT_NAME);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!(preparedProducts.length)
            && (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}

          {Boolean(preparedProducts.length) && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {preparedProducts.map((product) => {
                  const { name: productName, category, user, id } = product;
                  const { title, icon } = category;
                  const { name: userName, sex } = user;

                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{productName}</td>
                      <td data-cy="ProductCategory">
                        {`${icon} - ${title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={cl(
                          { 'has-text-link': sex === SEX_MALE },
                          { 'has-text-danger': sex === SEX_FEMALE },
                        )}
                      >
                        {userName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
