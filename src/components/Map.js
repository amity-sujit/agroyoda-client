import React, { useEffect, useState, useCallback, useContext } from 'react';
import Plotly from 'react-plotly.js';
import axios from 'axios';
import { AuthContext } from '../App';

function Map() {
  const [crop, setCrop] = useState('SUGARCANE');
  const [year, setYear] = useState('');
  const [yieldData, setYieldData] = useState(null);
  const [years, setYears] = useState([]);
  const { token, isAuthenticated } = useContext(AuthContext);

  // Fetch available years for the crop
  const fetchYears = useCallback(async () => {
    try {
      const response = await axios.get('https://agro-node-api-centralcanada.azurewebsites.net/api/features/years', {
        params: { crop },
        headers: { Authorization: `Bearer ${token}` },
      });
      const availableYears = response.data;
      console.log('Fetched years:', availableYears);
      setYears(availableYears);
      setYear(availableYears[0] || ''); // Set first year
    } catch (error) {
      console.error('Error fetching years:', error.response?.data || error.message);
    }
  }, [crop, token]);

  // Fetch features for the selected crop and year
  const fetchFeatures = useCallback(async () => {
    if (!year) return; // Wait until year is set
    try {
      const response = await axios.get('https://agro-node-api-centralcanada.azurewebsites.net/api/features', {
        params: { crop, year },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      console.log('Fetched features:', data);
      setYieldData(data);
    } catch (error) {
      console.error('Error fetching features:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    }
  }, [crop, year, token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchYears();
    }
  }, [crop, isAuthenticated, fetchYears]);

  useEffect(() => {
    if (isAuthenticated && year) {
      fetchFeatures();
    }
  }, [year, isAuthenticated, fetchFeatures]);

  useEffect(() => {
    if (years.length > 0 && isAuthenticated) {
      let currentYearIndex = years.indexOf(year);
      const cropSelect = ['SUGARCANE', 'CORN', 'WHEAT'];
      let currentCropIndex = cropSelect.indexOf(crop);

      const interval = setInterval(() => {
        currentYearIndex = (currentYearIndex + 1) % years.length;
        setYear(years[currentYearIndex]);

        if (currentYearIndex === 0) {
          currentCropIndex = (currentCropIndex + 1) % cropSelect.length;
          setCrop(cropSelect[currentCropIndex]);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [year, years, crop, isAuthenticated]);

  const getPlotData = () => {
    if (!yieldData || !year) return { data: [], layout: {} };
    const filteredFeatures = yieldData.features.filter(f => f.properties.YEAR === parseInt(year));
    const states = filteredFeatures.map(f => f.properties.STATE_ALPHA);
    const values = filteredFeatures.map(f => f.properties.VALUE || 0);

    return {
      data: [{
        type: 'choropleth',
        locations: states,
        locationmode: 'USA-states',
        z: values,
        colorscale: 'YlGn',
        marker: { line: { color: 'black', width: 1 } },
        colorbar: { title: 'Yield (Units Vary)' },
      }],
      layout: {
        title: `${crop} Yield by State (${year})`,
        geo: { scope: 'usa', framecolor: 'black', showframe: true },
        width: 800,
        height: 600,
      },
    };
  };

  const { data, layout } = getPlotData();

  return (
    <div>
      <div id="controls">
        <label>Crop:</label>
        <select value={crop} onChange={(e) => setCrop(e.target.value)}>
        <option value="ALMONDS">Almonds</option>
                    <option value="APPLES">Apples</option>
                    <option value="APRICOTS">Apricots</option>
                    <option value="ARTICHOKES">Artichokes</option>
                    <option value="ASPARAGUS">Asparagus</option>
                    <option value="AVOCADOS">Avocados</option>
                    <option value="BANANAS">Bananas</option>
                    <option value="BARLEY">Barley</option>
                    <option value="BEANS">Beans</option>
                    <option value="BEETS">Beets</option>
                    <option value="BLACKBERRIES">Blackberries</option>
                    <option value="BLUEBERRIES">Blueberries</option>
                    <option value="BOYSENBERRIES">Boysenberries</option>
                    <option value="BROCCOLI">Broccoli</option>
                    <option value="BRUSSELS SPROUTS">Brussels sprouts</option>
                    <option value="CABBAGE">Cabbage</option>
                    <option value="CANOLA">Canola</option>
                    <option value="CARROTS">Carrots</option>
                    <option value="CAULIFLOWER">Cauliflower</option>
                    <option value="CELERY">Celery</option>
                    <option value="CHERRIES">Cherries</option>
                    <option value="CHICKPEAS">Chickpeas</option>
                    <option value="COFFEE">Coffee</option>
                    <option value="CORN">Corn</option>
                    <option value="COTTON">Cotton</option>
                    <option value="CRANBERRIES">Cranberries</option>
                    <option value="CUCUMBERS">Cucumbers</option>
                    <option value="DATES">Dates</option>
                    <option value="EGGPLANT">Eggplant</option>
                    <option value="ESCAROLE & ENDIVE">Escarole & endive</option>
                    <option value="FIGS">Figs</option>
                    <option value="FLAXSEED">Flaxseed</option>
                    <option value="GARLIC">Garlic</option>
                    <option value="GINGER ROOT">Ginger root</option>
                    <option value="GRAPEFRUIT">Grapefruit</option>
                    <option value="GRAPES">Grapes</option>
                    <option value="GREENS">Greens</option>
                    <option value="GUAVAS">Guavas</option>
                    <option value="HAY">Hay</option>
                    <option value="HAY & HAYLAGE">Hay & haylage</option>
                    <option value="HAYLAGE">Haylage</option>
                    <option value="HAZELNUTS">Hazelnuts</option>
                    <option value="HEMP">Hemp</option>
                    <option value="HOPS">Hops</option>
                    <option value="KIWIFRUIT">Kiwifruit</option>
                    <option value="LEGUMES">Legumes</option>
                    <option value="LEMONS">Lemons</option>
                    <option value="LENTILS">Lentils</option>
                    <option value="LETTUCE">Lettuce</option>
                    <option value="MACADAMIAS">Macadamias</option>
                    <option value="MAPLE SYRUP">Maple syrup</option>
                    <option value="MELONS">Melons</option>
                    <option value="MILLET">Millet</option>
                    <option value="MINT">Mint</option>
                    <option value="MUSHROOMS">Mushrooms</option>
                    <option value="MUSTARD">Mustard</option>
                    <option value="NECTARINES">Nectarines</option>
                    <option value="OATS">Oats</option>
                    <option value="OKRA">Okra</option>
                    <option value="OLIVES">Olives</option>
                    <option value="ONIONS">Onions</option>
                    <option value="ORANGES">Oranges</option>
                    <option value="PAPAYAS">Papayas</option>
                    <option value="PEACHES">Peaches</option>
                    <option value="PEANUTS">Peanuts</option>
                    <option value="PEARS">Pears</option>
                    <option value="PEAS">Peas</option>
                    <option value="PECANS">Pecans</option>
                    <option value="PEPPERS">Peppers</option>
                    <option value="PISTACHIOS">Pistachios</option>
                    <option value="PLUMS">Plums</option>
                    <option value="PLUMS & PRUNES">Plums & prunes</option>
                    <option value="POTATOES">Potatoes</option>
                    <option value="PRUNES">Prunes</option>
                    <option value="PUMPKINS">Pumpkins</option>
                    <option value="RADISHES">Radishes</option>
                    <option value="RAPESEED">Rapeseed</option>
                    <option value="RASPBERRIES">Raspberries</option>
                    <option value="RICE">Rice</option>
                    <option value="RYE">Rye</option>
                    <option value="SAFFLOWER">Safflower</option>
                    <option value="SORGHUM">Sorghum</option>
                    <option value="SOYBEANS">Soybeans</option>
                    <option value="SPINACH">Spinach</option>
                    <option value="SQUASH">Squash</option>
                    <option value="STRAWBERRIES">Strawberries</option>
                    <option value="SUGARBEETS">Sugarbeets</option>
                    <option value="SUGARCANE">Sugarcane</option>
                    <option value="SUNFLOWER">Sunflower</option>
                    <option value="SWEET CORN">Sweet corn</option>
                    <option value="SWEET POTATOES">Sweet potatoes</option>
                    <option value="TANGELOS">Tangelos</option>
                    <option value="TANGERINES">Tangerines</option>
                    <option value="TARO">Taro</option>
                    <option value="TOBACCO">Tobacco</option>
                    <option value="TOMATOES">Tomatoes</option>
                    <option value="WALNUTS">Walnuts</option>
                    <option value="WHEAT">Wheat</option>
        </select>
        <label>Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <Plotly data={data} layout={layout} />
    </div>
  );
}

export default Map;