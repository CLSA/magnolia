<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn\output;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function execute()
  {
    parent::execute();

    // when creating an output the file from an output source may be included
    $file = $this->get_argument( 'file', NULL );
    if( false !== strpos( util::get_header( 'Content-Type' ), 'application/octet-stream' ) && !is_null( $file ) )
    {
      // determine which file number we're uploading
      $file = 'filename' == $file ? 'filename1' : $file;
      $matches = NULL;
      if( !preg_match( '/filename([0-9]+)/', $file, $matches ) )
        throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );
      $file_number = $matches[1];

      $output_source_mod = lib::create( 'database\modifier' );
      $output_source_mod->limit( 1 );
      $output_source_mod->offset( $file_number-1 );
      $db_output = $this->get_leaf_record();
      $db_output_source = current( $db_output->get_output_source_object_list( $output_source_mod ) );
      $db_output_source->data = base64_encode( $this->get_file_as_raw() );
      $db_output_source->save();
    }
  }
}
