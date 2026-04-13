document.querySelectorAll('.skt').forEach(function (skt, index) {
  function updateBarWidth() {
    var barPct = parseFloat(skt.querySelector('.skf').style.width) / 100;
    var px = skt.offsetWidth * barPct;
    skt.style.setProperty('--bar-width', px + 'px');
  }

  updateBarWidth();
  window.addEventListener('resize', updateBarWidth);

  var ball = skt.querySelector('.skball');
  if (ball) {
    var delay = -(index * 0.31 + Math.random() * 0.2);
    ball.style.animationDelay = delay + 's';
  }
});

(function () {
  var el = document.getElementById('lapTimer');
  var start = Date.now();

  function tick() {
    var ms  = Date.now() - start;
    var min = Math.floor(ms / 60000);
    var sec = Math.floor((ms % 60000) / 1000);
    var cs  = Math.floor((ms % 1000) / 10);

    el.textContent =
      min + ':' +
      (sec < 10 ? '0' : '') + sec + '.' +
      (cs  < 10 ? '0' : '') + cs;

    requestAnimationFrame(tick);
  }

  tick();
})();

(function () {
  document.body.classList.add('js-ready');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
      } else {
        entry.target.classList.remove('on');
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.rev').forEach(function (el) {
    observer.observe(el);
  });
})();

(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skf').forEach(function (bar) {
          var width = bar.style.width;
          bar.style.width = '0';
          setTimeout(function () { bar.style.width = width; }, 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  var board = document.querySelector('.tboard');
  if (board) observer.observe(board);
})();

function typeLines(elementId, lines, speed) {
  var el = document.getElementById(elementId);
  if (!el) return;

  el.innerHTML = '';

  var lineIndex  = 0;
  var charIndex  = 0;
  var currentDiv = null;

  function nextChar() {
    if (lineIndex >= lines.length) {
      el.innerHTML += '<span class="radio-cursor"></span>';
      return;
    }

    if (charIndex === 0) {
      currentDiv = document.createElement('div');
      currentDiv.className = 'radio-line';
      el.appendChild(currentDiv);
    }

    currentDiv.textContent += lines[lineIndex][charIndex];
    charIndex++;

    if (charIndex >= lines[lineIndex].length) {
      lineIndex++;
      charIndex = 0;
      setTimeout(nextChar, speed * 3);
    } else {
      setTimeout(nextChar, speed);
    }
  }

  nextChar();
}

var obsProfile = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      typeLines('radioProfile', [
        '// engineer profile \u2014 2026',
        '{',
        '\u00A0\u00A0"name":          "Thomas Sajus",',
        '\u00A0\u00A0"role":          "Software Engineer",',
        '\u00A0\u00A0"constructor":   "CGI France",',
        '\u00A0\u00A0"academy":       "ENSEIRB-MATMECA",',
        '\u00A0\u00A0"focus":         "international mobility",',
        '\u00A0\u00A0"championships": 2,',
        '}'
      ], 28);
      obsProfile.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

var obsContact = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      typeLines('radioContact', [
        '// race engineer comms',
        '{',
        '\u00A0\u00A0"status":   "seeking 3-month international mobility",',
        '\u00A0\u00A0"sector":   "motorsport / software",',
        '\u00A0\u00A0"stack":    "software / networks / data",',
        '\u00A0\u00A0"strategy": "data engineering",',
        '\u00A0\u00A0"pit_stop": "< 48h",',
        '\u00A0\u00A0"available": true',
        '}'
      ], 28);
      obsContact.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

var radioProfile = document.getElementById('radioProfile');
var radioContact = document.getElementById('radioContact');

if (radioProfile) obsProfile.observe(radioProfile);
if (radioContact) obsContact.observe(radioContact);

(function () {
  var grid = document.getElementById('projGrid');
  var user = 'TheRevGodish';

  var langColors = {
    JavaScript: '#f1e05a',
    Python:     '#3572A5',
    C:          '#aaa',
    'C++':      '#f34b7d',
    Java:       '#b07219',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    Shell:      '#89e051',
    TypeScript: '#2b7489',
    Go:         '#00ADD8',
    Rust:       '#dea584',
    PHP:        '#4F5D95'
  };

  fetch(
    'https://api.github.com/users/' + user + '/repos?sort=updated&per_page=6',
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  )
    .then(function (response) {
      if (!response.ok) throw response.status;
      return response.json();
    })
    .then(function (repos) {
      var list = repos.filter(function (r) { return !r.fork; }).slice(0, 6);
      if (!list.length) throw 'empty';

      grid.innerHTML = list.map(function (repo) {
        var color = langColors[repo.language] || '#888';
        var date  = new Date(repo.updated_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        var lang  = repo.language
          ? '<div class="plng" style="color:' + color + '"><div class="plng-dot" style="background:' + color + '"></div>' + repo.language + '</div>'
          : '';
        var stars = repo.stargazers_count > 0 ? '&#9733; ' + repo.stargazers_count + ' ' : '';
        var forks = repo.forks_count       > 0 ? '&#10522; ' + repo.forks_count + ' '   : '';

        return (
          '<a href="' + repo.html_url + '" target="_blank" rel="noopener" class="pc">'
          + '<div class="pimg">'
          +   '<img src="https://opengraph.githubassets.com/2/' + user + '/' + repo.name + '"'
          +     ' alt="' + repo.name + '" loading="lazy" onerror="this.style.display=\'none\'">'
          +   '<div class="pph">// ' + repo.name + '</div>'
          +   lang
          + '</div>'
          + '<div class="pbody">'
          +   '<div class="pname">' + repo.name + '</div>'
          +   '<div class="pdesc">' + (repo.description || '// no description') + '</div>'
          +   '<div class="pfoot"><span>' + stars + forks + '&#8635; ' + date + '</span>'
          +     '<div class="parr">&#8599;</div>'
          +   '</div>'
          + '</div>'
          + '</a>'
        );
      }).join('');
    })
    .catch(function () {
      grid.innerHTML =
        '<div class="pload">'
        + '<a href="https://github.com/' + user + '" target="_blank" style="color:var(--r);text-decoration:none">'
        + 'github.com/' + user
        + '</a></div>';
    });
})();