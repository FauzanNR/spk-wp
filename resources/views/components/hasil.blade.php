  <div id="hasil" class="page hidden">
      <div class="bg-white p-6 rounded shadow">
          @csrf
          @method('PUT') {{-- Or @method('PATCH') --}}
          <div class="mt-6">
              <div id="hasil-container">
              </div>
          </div>
      </div>
  </div>