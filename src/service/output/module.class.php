<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\output;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'output_type', 'output.output_type_id', 'output_type.id' );
    $modifier->join( 'reqn', 'output.reqn_id', 'reqn.id' );
    $modifier->join( 'language', 'reqn.language_id', 'language.id' );
    $modifier->join( 'reqn_current_final_report', 'reqn.id', 'reqn_current_final_report.reqn_id' );
    $modifier->left_join( 'final_report', 'reqn_current_final_report.final_report_id', 'final_report.id' );

    // add the total number of output_sources
    if( $select->has_column( 'output_source_count' ) )
      $this->add_count_column( 'output_source_count', 'output_source', $select, $modifier );

    // add empty values for the output source fields (they are only used when adding new outputs)
    if( $select->has_column( 'filename' ) ) $select->add_constant( NULL, 'filename' );
    if( $select->has_column( 'url' ) ) $select->add_constant( NULL, 'url' );
    for( $i = 1; $i <= 10; $i++ )
    {
      $column_name = 'filename'.$i;
      if( $select->has_column( $column_name ) ) $select->add_constant( NULL, $column_name );
    }
  }

  /**
   * Extend parent method
   */
  public function post_write( $record )
  {
    if( $record && 'POST' == $this->get_method() )
    {
      $post_array = $this->get_file_as_array();

      // add the output source record
      $column_list = array_keys( $post_array );
      if( in_array( 'filename', $column_list ) || in_array( 'url', $column_list ) )
      {
        try
        {
          $db_output_source = lib::create( 'database\output_source' );
          $db_output_source->output_id = $record->id;
          if( array_key_exists( 'filename', $post_array ) )
            $db_output_source->filename = $post_array['filename'];
          if( array_key_exists( 'url', $post_array ) )
            $db_output_source->url = $post_array['url'];
          $db_output_source->save();
        }
        catch( \cenozo\exception\database $e )
        {
          $this->get_status()->set_code( $e->is_missing_data() ? 400 : 500 );
          throw $e;
        }
      }

      // add multiple output source records
      foreach( $post_array as $column => $filename )
      {
        if( preg_match( '/filename[0-9]+/', $column ) )
        {
          try
          {
            $db_output_source = lib::create( 'database\output_source' );
            $db_output_source->output_id = $record->id;
            $db_output_source->filename = $filename;
            $db_output_source->save();
          }
          catch( \cenozo\exception\database $e )
          {
            $this->get_status()->set_code( $e->is_missing_data() ? 400 : 500 );
            throw $e;
          }
        }
      }
    }
  }
}
