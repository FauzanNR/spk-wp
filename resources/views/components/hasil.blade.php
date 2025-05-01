  <div id="hasil" class="page hidden">
      <div class="bg-white p-6 rounded shadow">
          <h2 class="text-2xl font-bold text-center">
              Hasil Page Content
          </h2>
          @csrf
          @method('PUT') {{-- Or @method('PATCH') --}}
          <div class="mt-6">
              <div id="hasil-container">
              </div>
          </div>
      </div>
  </div>