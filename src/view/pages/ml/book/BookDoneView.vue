<template>
  <div class="px-5" id="page-done-books">
    <BookTable
      :books="books"
      type="done"
      @createBookClicked="createBook"
      @selectBookClicked="selectBook"
      @deleteBookClicked="deleteBook"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-live-book-container"
      ref="edit-live-book"
      id="edit-live-book"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form class="mt-8" @submit="submitBook">
          <b-form-group id="input-group-book_id" label="ID" label-for="input-book_id">
            <b-form-input
              id="input-book_id"
              v-model="form.id"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-1" label="Namn på booken" label-for="input-1">
            <b-form-input id="input-1" v-model="form.name" type="text"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Från Datum" label-for="input-2">
            <b-form-datepicker id="input-2" v-model="form.from" class="mb-2"> </b-form-datepicker>
          </b-form-group>

          <b-form-group id="input-group-3" label="Till Datum" label-for="input-3">
            <b-form-datepicker id="input-3" v-model="form.to" class="mb-2"> </b-form-datepicker>
          </b-form-group>

          <b-button type="submit" variant="primary">Spara</b-button>
        </b-form>

         
      </div>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import BookTable from '@/view/pages/ml/book/BookTable.vue';

export default {
  name: 'booksdone',
  components: {
    BookTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentBookId'])
  },
  mounted() {
    //this.loadBooks();
  },
  data() {
    return {
      form: {
        id: '',
        from: '',
        to: '',
        name: ''
      },
      loaded: false,
      creating: false,
      editing: false,
      books: [
        {
            book_id: 1,
            created_at: '2020-01-01 22:00:11',
            external_id: 1122
        },
        {
            book_id: 2,
            created_at: '2020-01-01 22:00:11',
            external_id: 1123
        },
        {
            book_id: 3,
            created_at: '2020-01-01 22:00:11',
            external_id: 1124
        }
      ]
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadBooks();
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadBooks();
    },
    submitBook(e) {
      e.preventDefault();

      this.updateBook();
    },
    updateBook() {
      if (this.creating) {
        axios
          .post('/book', this.form)
          .then(res => {
            if (res.status === 201) {
              this.creating = false;
              this.form = res.data.book;
              this.toastr('success', 'OK', 'Verifikat skapades');
              this.loadBooks();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa verifikat');
          });
      } else {
        axios
          .put('/book', this.form)
          .then(res => {
            if (res.status === 204) {
              this.creating = false;
              this.form = res.data.book;
              this.toastr('success', 'OK', 'Verifikatet uppdaterades');
              this.loadBooks();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera verifikatet');
          });
      }
    },
    createBook() {
      this.creating = true;
      this.editing = true;

      this.scrollToEditBook();

      this.form.company_id = this.currentCompanyId;
      this.form.book_id = this.currentBookId;
    },
    deleteBook(book_id) {
      axios
        .delete(`/book?book_id=${book_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.books = this.books.filter(item => item.book_id !== book_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Verifikatet togs bort');

          this.loadBooks();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort verifikatet');
        });
    },
    selectBook(book_id) {
      for (var i = 0; i < this.books.length; ++i) {
        if (this.books[i].id === book_id) {
          this.form = this.books[i];
        }
      }

      this.creating = false;
      this.editing = true;

      this.scrollToEditBook();
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    async loadBooks() {
      this.books = [];
      axios
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.books = res.data.company.books;

            this.loaded = true;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista verifikat');
        });
    },
    scrollToEditBook() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('edit-live-book-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
