 console.log(err);
      const countries = await fetchCountries();

      res.render("index.js",{
        countries: countries,
        total: countries.length,
        error: "Country already added, try again!"
      });