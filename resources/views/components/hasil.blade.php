  <div id="hasil" class="page hidden">
      <div class="bg-white p-6 rounded shadow">
          <script src="js/hasil.js"></script>
          <h2 class="text-2xl font-bold text-center">
              Hasil Page Content
          </h2>
          @csrf
          @method('PUT') {{-- Or @method('PATCH') --}}
          <div class="mt-6">
              <div id="hasil-container">
                  <table class="w-full bg-white rounded shadow">
                      <tbody id="hasil-table">
                          <!-- Data will be inserted here -->
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  </div>