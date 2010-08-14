<?php
if (isset($message)) :
  switch ($message) :
    case 'invalid-id' :
?>
    <p class="message">The ID is not valid. Please try again.</p>
<?php
      break;
    case 'invalid-searchterm' :
?>
    <p class="message">The search term is not valid. Please try again.</p>
<?php
      break;
  endswitch;
endif;
?>


          <form action="add-movie.php">
            <p>
              <label for="id">IMDb ID</label>
              <input type="text" class="text" name="id" id="id">
              <input type="submit" class="submit" value="Look-up&hellip;">
              <input type="hidden" name="step" value="3">
            </p>
          </form>
          <p class="or">or</p>
          <form action="add-movie.php">
            <p>
              <label for="q">Search</label>
              <input type="text" class="text" name="q" id="q">
              <input type="submit" class="submit" value="Search&hellip;">
              <input type="hidden" name="step" value="2">
            </p>
          </form>
