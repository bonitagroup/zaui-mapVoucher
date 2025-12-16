

  export const openMap = (lat, lng) => {

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.location.href = url;
  };