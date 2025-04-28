import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import 'bulma/css/bulma.min.css';

const UserList = () => {
  // State Management
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10); // Jumlah data per halaman
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState(''); // Kata kunci pencarian
  const [query, setQuery] = useState(''); // Input pencarian
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Fetch Data dari API
  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/?search_query=${keyword}&page=${page}&limit=${limit}`
      );
      setUsers(response.data.result || []); // Pastikan data selalu berupa array
      setPage(response.data.page || 0);
      setPages(response.data.totalPage || 0);
      setRows(response.data.totalRows || 0);
      setError('');
    } catch (err) {
      console.error(err); // Debugging
      setError('Failed to fetch data. Please try again later.');
    }
  }, [keyword, page, limit]);

  // Panggil getUsers saat page atau keyword berubah
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(query); // Perbarui keyword dengan nilai dari query
    setPage(0); // Reset ke halaman pertama
  };

  // Fungsi untuk menangani perubahan halaman
  const changePage = ({ selected }) => {
    setPage(selected);
    if(selected === 9){
        setMsg('Jika Data Tidak Ditemukan, Silahkan Ubah Kata Kunci Pencarian Anda!');
    }else{
        setMsg('');

    }
  };

  return (
    <div className="container mt-5">
      <div className="columns">
        <div className="column is-centered">
          {/* Form Pencarian */}
          <form onSubmit={handleSearch}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  placeholder="Find something here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="control">
                <button type="submit" className="button is-info">
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Pesan Error */}
          {error && <p className="has-text-danger">{error}</p>}

          {/* Tabel Data */}
          <table className="table is-striped is-bordered is-fullwidth mt-2">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="has-text-centered">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="has-text-centered mt-3">
            Total Rows: {rows} | Page: {rows ? page + 1 : 0} of {pages}
          </p>
              <p className='has-text-centered has-text-danger'>{msg}</p>
          {/* Pagination */}
          <nav className="pagination is-centered mt-3" role="navigation" aria-label="pagination">
          <ReactPaginate
            previousLabel={'< Prev'}
            nextLabel={'Next >'}
            breakLabel={'...'}
            pageCount={Math.min(10, pages)} // Batasi tampilan hingga 10 halaman
            onPageChange={changePage} // Fungsi untuk menangani perubahan halaman
            containerClassName={'pagination-list'} // Container untuk daftar pagination
            pageLinkClassName={'pagination-link'} // Kelas untuk setiap halaman
            previousLinkClassName={'pagination-previous'} // Kelas untuk tombol Previous
            nextLinkClassName={`pagination-next ${page === Math.min(10, pages) - 1 ? 'is-disabled' : ''}`} // Tambahkan kelas is-disabled jika di halaman terakhir
            activeClassName={'is-current'} // Kelas untuk halaman aktif pada <li>
            activeLinkClassName={'is-current'} // Kelas untuk halaman aktif pada <a>
            disabledClassName={'is-disabled'} // Kelas untuk tombol yang dinonaktifkan
            forcePage={page} // Pastikan halaman aktif sesuai dengan state
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserList;