
          <form action="add-movie.php" method="post">
            <table>
              <tr>
                <th>Title</th>
                <td><?php echo utf8_encode(html_entity_decode($title)); ?></td>
              </tr>
              <tr>
                <th>Non-English</th>
                <td>
<?php
if (!empty($languages)) :
?>
                  <label for="language">Language</label>
                  <select name="language" id="language">
<?php
  foreach ($languages as $lang) :
    if (in_array($lang, array('Mandarin', 'Cantonese')))
      $lang = 'Chinese';
    
    if ($lang == 'Flemish')
      $lang = 'Dutch';
    
    if (isset($modernlanguages[$lang])) :
      $languageCode = $modernlanguages[$lang];
    ?>
                    <option value="<?php echo $languageCode; ?>"><?php echo $lang; ?></option>
<?php
    endif;
  endforeach;
?>
                  </select>
<?php
endif;
?>
                  <label for="english-title">English title</label>
                  <select name="english-title" id="english-title">
                    <option value="none">None</option>
<?php
if (!empty($aka)) :
  $i = 0;
  foreach ($aka as $title) :
    ?>
                    <option value="<?php echo $i; ?>"><?php echo utf8_encode(html_entity_decode(strip_tags($title['title']))); ?></option>
<?php
    ++$i;
  endforeach;
endif;
?>
                  </select>
                </td>
              </tr>
              <tr>
                <th><label for="rating">Rating</label></th>
                <td>
                  <select name="rating" id="rating">
<?php
for ($i = 1; $i < 11; ++$i) :
?>
                    <option value="<?php echo $i; ?>"<?php if (isset($rating) && $rating == $i) : echo " selected"; endif; ?>><?php echo $i; ?></option>
<?php
endfor;
?>
                  </select>
                </td>
              </tr>
<?php
if (isset($runtime)) :
?>
              <tr>
                <th><label for="runtime">Runtime</label></th>
                <td><input id="runtime" name="runtime" value="1" class="text" style="width:30px;margin:0 2px"> minutes</td>
              </tr>
<?php
endif;
?>
            </table>
            <p class="buttons">
              <input type="submit" class="submit" value="Add movie&hellip;">
              <input type="hidden" name="step" value="4">
              <input type="hidden" name="imdbid" value="<?php echo $imdbid; ?>">
            </p>
          </form>
